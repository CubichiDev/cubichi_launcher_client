// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_log::LogTarget;

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Webview, LogTarget::Stdout, LogTarget::LogDir])
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
