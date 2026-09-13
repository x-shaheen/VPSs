FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    wget \
    git \
    sudo \
    ca-certificates \
    openssh-server \
    net-tools \
    iproute2 \
    iputils-ping \
    procps \
    htop \
    nano \
    vim \
    python3 \
    python3-pip \
    unzip \
    zip \
    tar \
    gzip \
    jq \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /run/sshd

RUN useradd \
    -m \
    -s /bin/bash \
    cloud

RUN echo "cloud ALL=(ALL) NOPASSWD:ALL" \
    > /etc/sudoers.d/cloud

RUN chmod 0440 /etc/sudoers.d/cloud

RUN sed -i \
    's/#PermitRootLogin prohibit-password/PermitRootLogin no/' \
    /etc/ssh/sshd_config

RUN sed -i \
    's/#PasswordAuthentication yes/PasswordAuthentication no/' \
    /etc/ssh/sshd_config

RUN sed -i \
    's/PasswordAuthentication yes/PasswordAuthentication no/' \
    /etc/ssh/sshd_config

WORKDIR /workspace

COPY start-server.sh /usr/local/bin/start-server.sh

RUN chmod +x /usr/local/bin/start-server.sh

EXPOSE 22
EXPOSE 8080

CMD ["/usr/local/bin/start-server.sh"]
