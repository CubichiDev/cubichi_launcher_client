// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::LevelFilter;
use tauri_plugin_log::{fern::colors::ColoredLevelConfig, LogTarget};

fn main() {
    tauri::Builder::default()
        // .invoke_handler(tauri::generate_handler![downloadJava])
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Webview, LogTarget::Stdout, LogTarget::LogDir])
                .with_colors(ColoredLevelConfig::default())
                .level(LevelFilter::Info)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
