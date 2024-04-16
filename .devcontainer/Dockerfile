FROM mcr.microsoft.com/devcontainers/javascript-node:20

RUN \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . ~/.bashrc \
    && nvm install 21 \
    && npm -g uninstall eslint \
    && npm cache clean --force > /dev/null 2>&1
