#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct MyAdder {
    sum: i32,
    msg: String,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn simple_command() {
    println!("Simple command executed!");
}

#[tauri::command]
fn add_command(adder: MyAdder) -> MyAdder {
    let MyAdder { sum, msg } = adder;
    MyAdder {
        sum: sum + 1,
        msg: msg,
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let id = app.listen_global("front-to-back", |event| {
                println!("payload: {:?}", event.payload.unwrap())
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, simple_command, add_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
