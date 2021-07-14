/// The size of a MIME encrypted line.
pub const CHUNK_SIZE: usize = 72;

/// The available algorithms.
pub const ALGORITHMS: &[& str] = &["crypt-aes-256-gcm",
				   "crypt-aes-256-gcm-siv"];

// PKCS7 padding for a 32 byte array.
pub fn pkcs7_pad32(bytes: &[u8]) -> [u8; 32] {
    let mut n = bytes.len();
    let mut m = n;
    if n > 31 {
        m = 0;
        n = 31;
    }
    let mut arr = [m as u8; 32];
    arr[..n].clone_from_slice(&bytes[..n]);
    arr
}

/// Create the header subject for the prefix and suffix.
///
/// # Arguments
/// * `algorithm`: The algorithm identifier.
/// * `kind`: Which kind of title: prefix or suffix?
///
/// # Returns
/// The header subject string.
pub fn header_subject(algorithm: String, kind: String) -> String {
    if !is_valid_algorithm(algorithm.to_string()) {
        return "error:header:invalid-algorithm".to_string();
    }
    let title = format!("{} {}", algorithm, kind);
    let len = title.len();
    let iw = len + 2; // include the surrounding spaces
    let rw = (CHUNK_SIZE - iw) / 2;
    let mut lw = rw;
    if (len % 2) == 1 {
        lw += 1;
    }
    let lws = format!("{:-<width$}", "", width=lw);
    let rws = format!("{:->width$}", "", width=rw);
    let header = format!("{} {} {}", lws, title, rws);
    header
}

/// Return the header prefix.
///
/// # Arguments
/// * `algorithm`: The algorithm identifier.
///
/// # Returns
/// The header prefix.
pub fn header_prefix(algorithm: String) -> String {
    header_subject(algorithm, "prefix".to_string())
}

/// Return the header suffix.
///
/// # Arguments
/// * `algorithm`: The algorithm identifier.
///
/// # Returns
/// The header suffix.
pub fn header_suffix(algorithm: String) -> String {
    header_subject(algorithm, "suffix".to_string())
}

/// Is this a valid algorithm id?
///
/// Although this is an O(N) search, that is okay because
/// the number of algorithms is very small.
///
/// # Arguments
/// * `provisional`: The provisional algorithm identifier.
///
/// # Returns
/// True if it is valid or false otherwise.
pub fn is_valid_algorithm(provisional: String) -> bool {
    for algorithm in ALGORITHMS {
        if *algorithm == provisional {
            return true
        }
    }
    false
}
