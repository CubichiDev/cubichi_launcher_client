# Name of the Docker image
IMAGE_NAME = tauri-compiler

# Build the Docker container
build:
	@docker build -t $(IMAGE_NAME) .

# Compile for Windows. Depends on .cargo/config.toml xwin lib paths
compile: build
	@docker run --name tauri-compiler --rm -v $(PWD):/app $(IMAGE_NAME)

kill:
	@docker kill tauri-compiler

.PHONY: build compile-windows compile-macos
