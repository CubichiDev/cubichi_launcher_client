# Using the official Rust image
FROM rust:latest

ENV KEYRINGS /usr/local/share/keyrings
ENV NODE_VERSION=20.7.0
ENV NVM_DIR=/root/.nvm
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# Add keys and sources for LLVM and Wine
RUN set -eux; \
    mkdir -p $KEYRINGS; \
    apt-get update; \
    apt-get install -y gpg curl; \
    curl --fail https://apt.llvm.org/llvm-snapshot.gpg.key | gpg --dearmor > $KEYRINGS/llvm.gpg; \
    curl --fail https://dl.winehq.org/wine-builds/winehq.key | gpg --dearmor > $KEYRINGS/winehq.gpg; \
    echo "deb [signed-by=$KEYRINGS/llvm.gpg] http://apt.llvm.org/bullseye/ llvm-toolchain-bullseye-13 main" > /etc/apt/sources.list.d/llvm.list; \
    echo "deb [signed-by=$KEYRINGS/winehq.gpg] https://dl.winehq.org/wine-builds/debian/ bullseye main" > /etc/apt/sources.list.d/winehq.list;

# Install tools and dependencies, and set up symlinks
RUN set -eux; \
    dpkg --add-architecture i386; \
    apt-get update; \
    apt-get install --no-install-recommends -y \
        clang-13 llvm-13 lld-13 winehq-staging tar \
        nsis libwebkit2gtk-4.0-dev build-essential wget file libssl-dev \
        libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev; \
    ln -s clang-13 /usr/bin/clang && ln -s clang /usr/bin/clang++ && ln -s lld-13 /usr/bin/ld.lld; \
    ln -s clang-13 /usr/bin/clang-cl && ln -s llvm-ar-13 /usr/bin/llvm-lib && ln -s lld-link-13 /usr/bin/lld-link; \
    update-alternatives --install /usr/bin/cc cc /usr/bin/clang 100; \
    update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++ 100; \
    rm -rf /var/lib/apt/lists/*;

# Install Node.js and npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} && \
    . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION} && \
    . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION};

# Install Tauri CLI and Rust targets
RUN cargo install tauri-cli && \
    rustup target add x86_64-pc-windows-msvc x86_64-apple-darwin aarch64-apple-darwin;

# Setup xwin
RUN set -eux; \
    xwin_version="xwin-0.1.1"; \
    xwin_prefix="xwin-$xwin_version-x86_64-unknown-linux-musl"; \
    curl --fail -L https://github.com/Jake-Shadle/xwin/releases/download/$xwin_version/$xwin_prefix.tar.gz | tar -xzv -C /usr/local/cargo/bin --strip-components=1 $xwin_prefix/xwin; \
    xwin --accept-license 1 splat --output /xwin; \
    rm -rf .xwin-cache /usr/local/cargo/bin/xwin;

# Environment variables
ENV CC_x86_64_pc_windows_msvc="clang-cl" \
    CXX_x86_64_pc_windows_msvc="clang-cl" \
    AR_x86_64_pc_windows_msvc="llvm-lib" \
    WINEDEBUG="-all" \
    CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_RUNNER="wine" \
    CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_LINKER="lld-link" \
    RUSTFLAGS="-Lnative=/xwin/crt/lib/x86_64 -Lnative=/xwin/sdk/lib/um/x86_64 -Lnative=/xwin/sdk/lib/ucrt/x86_64" \
    CL_FLAGS="-Wno-unused-command-line-argument -fuse-ld=lld-link /imsvc/xwin/crt/include /imsvc/xwin/sdk/include/ucrt /imsvc/xwin/sdk/include/um /imsvc/xwin/sdk/include/shared" \
    CFLAGS_x86_64_pc_windows_msvc="$CL_FLAGS" \
    CXXFLAGS_x86_64_pc_windows_msvc="$CL_FLAGS"

# Run wineboot to setup the default WINEPREFIX
RUN wine wineboot --init

# Set working directory
WORKDIR /app

# ENTRYPOINT
ENTRYPOINT [ "sh", "-c", " \
    npm install && \
    cargo tauri build --target x86_64-pc-windows-msvc; \
"]
