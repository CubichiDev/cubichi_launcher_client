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

#[tauri::command]
fn run_jar(handle: tauri::AppHandle) {
    println!("Running jar");
    let resource_path = handle
        .path_resolver()
        .resolve_resource("assets/sample.jar")
        .expect("failed to resolve resource");

    let java_exe = match get_java_executable() {
        Some(java) => java,
        None => {
            println!("Failed to find Java executable.");
            return;
        }
    };

    let mut child = std::process::Command::new(java_exe)
        .arg("-jar")
        .arg(resource_path)
        .spawn()
        .expect("failed to spawn child process");

    let exit_status = child.wait().expect("failed to wait on child process");
    println!("child exited with: {}", exit_status);
}

fn get_java_executable() -> Option<String> {
    let java_home = std::env::var("JAVA_HOME").ok()?;
    let java_exe = format!("{}/bin/java", java_home);

    if std::path::Path::new(&java_exe).exists() {
        return Some(java_exe);
    }

    #[cfg(target_os = "windows")]
    let command = "where";
    #[cfg(not(target_os = "windows"))]
    let command = "which";

    let output = std::process::Command::new(command)
        .arg("java")
        .output()
        .ok()?;

    let path = String::from_utf8(output.stdout).ok()?;
    let path = path.trim();

    if path.is_empty() {
        None
    } else {
        Some(path.to_string())
    }
}
