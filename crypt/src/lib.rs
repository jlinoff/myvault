//! # WASM Encrypt/Decrypt Functions
//!
//! The library contains the `encrypt` and `decrypt` functions that are
//! exported for use in javascript via the WebAssembly interface (wasm).
//!
//! # Example Javascript Import
//! ```js
//! // Import the encrypt and decrypt functions.
//! // Must be in a module.
//! import { encrypt, decrypt, default as init } from './crypt.js';
//! async function load_wasm() {
//!     await init('./crypt_bg.wasm');
//!     window.encrypt = encrypt;
//!     window.decrypt = decrypt;
//! }
//! ```
//!
//! # Example Javascript Encrypt Usage
//! ```js
//! function encrypt(password, plaintext) {
//!    var result = window.encrypt("crypt-aes-256-gcm", pass, plaintext);
//!    return result;
//! }
//! ```
//!
//! # Example Javascript Decrypt Usage
//! ```js
//! function decrypt(password, ciphertext) {
//!    var result = window.decrypt("crypt-aes-256-gcm", pass, ciphertext);
//!    return result;
//! }
//! ```
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

mod shared;
use shared::ALGORITHMS;

mod aes_256_gcm;
mod aes_256_gcm_siv;

/// Return the module name.
#[wasm_bindgen]
pub fn get_name() -> String {
    "crypt".to_string()
}

/// Return the number of algorithms available.
#[wasm_bindgen]
pub fn get_num_algorithms() -> usize {
    ALGORITHMS.len()
}

/// Returns the n-th algorithm, zero based index.
#[wasm_bindgen]
pub fn get_algorithm(i: usize) -> String {
    if i < ALGORITHMS.len() {
        return ALGORITHMS[i].to_string();
    }
    format!("error:algorithms:invalid-index:{}", i)
}

/// Return the header prefix.
///
/// # Arguments
/// * `algorithm`: The algorithm identifier.
///
/// # Returns
/// The header prefix.
#[wasm_bindgen]
pub fn header_prefix(algorithm: String) -> String {
    shared::header_prefix(algorithm)
}

/// Return the header suffix.
///
/// # Arguments
/// * `algorithm`: The algorithm identifier.
///
/// # Returns
/// The header suffix.
#[wasm_bindgen]
pub fn header_suffix(algorithm: String) -> String {
    shared::header_suffix(algorithm)
}

/// Encrypts a string coming from Javascript using the specified algorithm.
///
/// It accepts a plaintext string and converts it a MIME encoded block
/// with a prefix and suffix.
///
/// # Arguments
/// * `algorithm`: The algorithm identifier.
/// * `password`: Used to encrypt the plaintext.
/// * `plaintext`: The string to encrypt.
///
/// # Returns
/// The encrypted, mime encoded ciphertext.
#[wasm_bindgen]
pub fn encrypt(algorithm: String, password: String, plaintext: String) -> String {
    if !shared::is_valid_algorithm(algorithm.to_string()) {
        return format!("error:encrypt:invalid:{}", algorithm);
    }
    if algorithm == "crypt-aes-256-gcm" {
        return aes_256_gcm::encrypt(password, plaintext);
    }
    if algorithm == "crypt-aes-256-gcm-siv" {
        return aes_256_gcm_siv::encrypt(password, plaintext);
    }
    format!("error:encrypt:not-implemented:{}", algorithm)
}

/// Decrypt a string.
///
/// It accepts a ciphertext string created by the `encrypt` function
/// and converts it back to a plaintext string.
///
/// # Arguments
/// * `algorithm`: The algorithm identifier.
/// * `password`: Used to encrypt the plaintext.
/// * `ciphertext`: he encrypted, mime encoded plaintext.
///
/// # Returns
/// The unencrypted plaintext to the caller.
#[wasm_bindgen]
pub fn decrypt(algorithm: String, password: String, ciphertext: String) -> String {
    if !shared::is_valid_algorithm(algorithm.to_string()) {
        return format!("error:decrypt:invalid:{}", algorithm);
    }
    if algorithm == "crypt-aes-256-gcm" {
        return aes_256_gcm::decrypt(password, ciphertext);
    }
    if algorithm == "crypt-aes-256-gcm-siv" {
        return aes_256_gcm_siv::decrypt(password, ciphertext);
    }
    format!("error:decrypt:not-implemented:{}", algorithm)
}

#[cfg(test)]
mod tests {
    use wasm_bindgen_test::*;
    extern crate wasm_bindgen;
    use crate::decrypt;
    use crate::encrypt;
    use crate::get_algorithm;
    use crate::get_num_algorithms;
    use crate::header_prefix;

    #[wasm_bindgen_test]
    pub fn test01() {
        // Verify that bad algorithms are caught.
        println!("test01: start");
        let algorithm = "bad-bad-bad";
        println!("test01: algorithm: {}", algorithm.to_string());

        let prefix = header_prefix(algorithm.to_string());
        println!("test02: prefix: {}", prefix.to_string());
        assert!(prefix.starts_with("error:header:invalid-algorithm"));

        let password = "secret";
        let plaintext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        println!("test01: encrypting");
        let ciphertext = encrypt(
            algorithm.to_string(),
            password.to_string(),
            plaintext.to_string(),
        );
        println!("test01: ciphertext={}", ciphertext.to_string());
        assert!(ciphertext.starts_with("error:encrypt:invalid:"));
        println!("test01: done");
    }

    #[wasm_bindgen_test]
    pub fn test02() {
        // Verify the algorithms interface.
        println!("test02: start");
        let num = get_num_algorithms();
        println!("test02: num={}", num);
        assert!(num > 0);
        assert!(num == 2);

        let al0 = get_algorithm(0);
        println!("test02: al0={}", al0);
        assert!(!al0.starts_with("error:"));

        let aln = get_algorithm(num + 1);
        println!("test02: aln={}", aln);
        assert!(aln.starts_with("error:"));

        println!("test02: done");
    }

    #[wasm_bindgen_test]
    pub fn test03() {
        // Verify that the aes-256-gcm encryption works.
        println!("test03: start");
        let algorithm = "crypt-aes-256-gcm";
        println!("test03: algorithm: {}", algorithm.to_string());

        let prefix = header_prefix(algorithm.to_string());
        println!("test03: prefix: {}", prefix.to_string());

        let password = "secret";
        let plaintext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        println!("test03: encrypting");
        let ciphertext = encrypt(
            algorithm.to_string(),
            password.to_string(),
            plaintext.to_string(),
        );
        println!("test03: decrypting");
        let testtext = decrypt(
            algorithm.to_string(),
            password.to_string(),
            ciphertext.to_string(),
        );
        println!("test03: '{}' ==? {}", &plaintext, &testtext);
        assert_eq!(&plaintext, &testtext);
        println!("test03: done");
    }

    #[wasm_bindgen_test]
    pub fn test04() {
        // Verify that the aes-256-gcm-siv encryption works.
        println!("test04: start");
        let algorithm = "crypt-aes-256-gcm-siv";
        println!("test04: algorithm: {}", algorithm.to_string());

        let prefix = header_prefix(algorithm.to_string());
        println!("test04: prefix: {}", prefix.to_string());

        let password = "secret";
        let plaintext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        println!("test04: encrypting");
        let ciphertext = encrypt(
            algorithm.to_string(),
            password.to_string(),
            plaintext.to_string(),
        );
        println!("test04: decrypting");
        let testtext = decrypt(
            algorithm.to_string(),
            password.to_string(),
            ciphertext.to_string(),
        );
        println!("test04: '{}' ==? {}", &plaintext, &testtext);
        assert_eq!(&plaintext, &testtext);
        println!("test04: done");
    }
}
