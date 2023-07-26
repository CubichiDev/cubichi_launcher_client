// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use directories::ProjectDirs;
use log::info;
use std::path::PathBuf;
use tauri::api::process::Command;
use tauri_plugin_log::LogTarget;

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Webview, LogTarget::Stdout, LogTarget::LogDir])
                .build(),
        )
        .invoke_handler(tauri::generate_handler![run_jar])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn run_jar() {
    let jar_path = get_jar_path();

    let _ = Command::new_sidecar("launch_jar")
        .expect("failed to create `my-sidecar` binary command")
        .args(&[jar_path.to_str().unwrap()])
        .spawn()
        .expect("Failed to spawn sidecar");

    info!("Running sidecar from rust");
}

fn get_jar_path() -> PathBuf {
    let project_dirs = ProjectDirs::from("com", "cubich", "cubich_launcher").unwrap();
    let data_dir = project_dirs.data_dir();
    let jar_path = data_dir.join("sample.jar");
    jar_path
}
