use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Person {
    id: i32,
    last_name: String,
    phone_number: String,
}

impl Person {
    pub fn new(id: i32, last_name: &str, phone_number: &str) -> Person {
        Person {
            id,
            last_name: last_name.to_string(),
            phone_number: phone_number.to_string()
        }
    }
}
