FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl wget git net-tools
# تجهيز بيئة تشغيل مشاريعك الخارقة داخل جذر الحاوية
EXPOSE 80 443
CMD ["bash"]

