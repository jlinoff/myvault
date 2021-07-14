use aes_gcm::aead::{generic_array::GenericArray, Aead, NewAead};
/// Implementation of the AES-256-GCM encrypt/decrypt algorithms.
use aes_gcm::Aes256Gcm; // Or `Aes128Gcm`

use crate::shared::{header_prefix, header_suffix, pkcs7_pad32, CHUNK_SIZE};

/// Encrypts a string coming from Javascript using the AES-256-GCM algorithm.
///
/// It accepts a plaintext string and converts it a MIME encoded block
/// with a prefix and suffix.
///
/// # Arguments
/// * `password`: Used to encrypt the plaintext.
/// * `plaintext`: The string to encrypt.
///
/// # Returns
/// The encrypted, mime encoded ciphertext.
pub fn encrypt(password: String, plaintext: String) -> String {
    let algorithm = "crypt-aes-256-gcm";

    // Define the key.
    let bytes = pkcs7_pad32(password.as_bytes()); // must be 32 bytes
    let key = GenericArray::from_slice(&bytes);

    // Define the nonce
    // Using the first N bytes of the key up to 12.
    let len = std::cmp::min(bytes.len(), 12);
    let nonce = GenericArray::from_slice(&bytes[0..len]);

    // Define the cipher.
    let cipher = Aes256Gcm::new(key);

    // Encrypt.
    //let ciphertext = cipher.encrypt(nonce, plaintext.as_ref())
    //    .expect("encryption failure!");
    let ciphertext;
    match cipher.encrypt(nonce, plaintext.as_ref()) {
        Ok(v) => ciphertext = v,
        Err(e) => {
            let err = format!("error:encrypt: invalid encrypt \"{}\"", e);
            return err;
        }
    }

    // Convert to base64.
    let ctb64 = base64::encode(ciphertext);

    // Convert the base64 string to 72 chars per line.
    // Honor the UTF-8 character boundaries.
    // CITATION: https://users.rust-lang.org/t/solved-how-to-split-string-into-multiple-sub-strings-with-given-length/10542/8
    let mut subs = Vec::with_capacity((CHUNK_SIZE - 1 + ctb64.len()) / CHUNK_SIZE);
    let mut pos = 0;
    let mut itr = ctb64.chars();
    while pos < ctb64.len() {
        let mut len = 0;
        for ch in itr.by_ref().take(CHUNK_SIZE) {
            len += ch.len_utf8(); // for multi-byte strings.
        }
        subs.push(&ctb64[pos..pos + len]);
        subs.push("\n");
        pos += len;
    }

    // Format the cipher text.
    let body = subs.join(&"".to_string());
    let prefix = header_prefix(algorithm.to_string());
    let suffix = header_suffix(algorithm.to_string());
    let mut result = prefix;
    result.push('\n');
    result.push_str(&body);
    result.push_str(&suffix);
    result.push('\n');
    result
}

/// Decrypt a string using AES-256-GCM.
///
/// It accepts a ciphertext string created by the `encrypt` function
/// and converts it back to a plaintext string.
///
/// # Arguments
/// * `password`: Used to encrypt the plaintext.
/// * `ciphertext`: he encrypted, mime encoded plaintext.
///
/// # Returns
/// The unencrypted plaintext to the caller.
pub fn decrypt(password: String, ciphertext: String) -> String {
    let algorithm = "crypt-aes-256-gcm";

    // Define the key.
    let bytes = pkcs7_pad32(password.as_bytes()); // must be 32 bytes
    let key = GenericArray::from_slice(&bytes);

    // Define the nonce
    // Using the first N bytes of the key up to 12.
    let len = std::cmp::min(bytes.len(), 12);
    let nonce = GenericArray::from_slice(&bytes[0..len]);

    // Define the cipher.
    let cipher = Aes256Gcm::new(key);

    // Get the base64 and decode it.
    // The string is formatted like this:
    //    <PREFIX>
    //    <base64>
    //    <SUFFIX>
    // If it is not in this format, it is rejected.
    let split = ciphertext.split('\n');
    let vec = split.collect::<Vec<&str>>();
    let prefix = vec[0].to_string();
    if prefix != header_prefix(algorithm.to_string()) {
        let err = format!("error:decrypt: invalid prefix \"{}\"", prefix);
        return err;
    }

    // Try to be a little resilient by allowing a new line at the end.
    let mut max = vec.len() - 1;
    let mut suffix = vec[max].to_string();
    let good_suffix = header_suffix(algorithm.to_string());
    if suffix != good_suffix {
        max -= 1;
        suffix = vec[max].to_string();
        if suffix != good_suffix {
            let err = format!("error:decrypt: invalid suffix \"{}\"", suffix);
            return err;
        }
    }

    // Get the body, this is the base64 data.
    let subs = &vec[1..max];
    let mut ctb64 = String::from("");
    for sub in subs {
        ctb64.push_str(sub);
    }
    let bytes;
    match base64::decode(ctb64.as_bytes()) {
        Ok(v) => bytes = v,
        Err(e) => {
            let err = format!("error:decrypt: invalid base64 conversion \"{}\"", e);
            return err;
        }
    }

    // Decrypt.
    let plaintext;
    match cipher.decrypt(nonce, bytes.as_ref()) {
        Ok(v) => plaintext = v,
        Err(e) => {
            let err = format!("error:decrypt: invalid decrypt \"{}\"", e);
            return err;
        }
    }
    //let plaintext = cipher.decrypt(nonce, bytes.as_ref())
    //    .expect("decryption failure!");
    std::str::from_utf8(&plaintext).unwrap().to_string()
}
