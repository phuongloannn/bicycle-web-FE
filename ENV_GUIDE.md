# Hướng dẫn cấu hình Environment Variables

## 📋 Thông tin Backend Server

- **Instance ID**: `i-0200cdaf258f1f0aa`
- **Instance Name**: `bike-shop-backend`
- **Public IP**: `47.129.172.108`
- **Private IP**: `172.31.9.52`

## 🔧 Cấu hình cho Local Development

### Tạo file `.env.local` trong thư mục `bicycle-web-FE/`

```env
# Backend API URL cho local development
# Sử dụng Public IP với port (thường là 3000)
NEXT_PUBLIC_API_BASE_URL=http://47.129.172.108:3000
```

**Lưu ý:**
- Thay `3000` bằng port thực tế mà backend đang chạy (nếu khác)
- Không thêm dấu `/` ở cuối URL
- Đảm bảo backend server đang chạy và có thể truy cập từ máy local của bạn

### Kiểm tra backend có đang chạy không:

```bash
# Test kết nối đến backend
curl http://47.129.172.108:3000/health
# hoặc mở browser: http://47.129.172.108:3000
```

## 🚀 Cấu hình cho Production (Vercel)

⚠️ **QUAN TRỌNG**: Vercel chỉ hỗ trợ HTTPS, không thể dùng HTTP trực tiếp với IP address.

### Option 1: Sử dụng Domain Name với SSL (Khuyến nghị)

Nếu bạn có domain name (ví dụ: `api.yourdomain.com`):

1. **Cấu hình DNS**: Trỏ domain đến IP `47.129.172.108`
2. **Cài đặt SSL**: Sử dụng Let's Encrypt hoặc SSL certificate khác
3. **Trong Vercel Dashboard**, thêm Environment Variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### Option 2: Sử dụng Nginx Reverse Proxy với SSL

1. **Cài đặt Nginx trên server backend**:

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

2. **Cấu hình Nginx** (`/etc/nginx/sites-available/backend`):

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Thay bằng domain của bạn

    location / {
        proxy_pass http://47.129.172.108:3000;  # Hoặc 127.0.0.1:3000 nếu Nginx chạy trên cùng server
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Kích hoạt site và cài SSL**:

```bash
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

4. **Trong Vercel Dashboard**, thêm:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
```

### Option 3: Sử dụng Cloudflare Tunnel (Miễn phí)

1. Đăng ký Cloudflare account
2. Cài đặt `cloudflared` trên server backend
3. Tạo tunnel và expose port 3000
4. Sử dụng URL HTTPS được cung cấp bởi Cloudflare

## 📝 Ví dụ các file .env

### `.env.local` (Local Development)
```env
NEXT_PUBLIC_API_BASE_URL=http://47.129.172.108:3000
```

### `.env.production` (Nếu build local cho production)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## ⚠️ Lưu ý quan trọng

### 1. Port Number
- Nếu backend chạy trên port mặc định (80 cho HTTP, 443 cho HTTPS), không cần thêm port
- Nếu backend chạy trên port khác (ví dụ: 3000), cần thêm port:
  - HTTP: `http://47.129.172.108:3000`
  - HTTPS: `https://api.yourdomain.com:3000` (nếu không dùng reverse proxy)

### 2. Trailing Slash
- **KHÔNG** thêm dấu `/` ở cuối URL
- ✅ Đúng: `http://47.129.172.108:3000`
- ❌ Sai: `http://47.129.172.108:3000/`

### 3. Security Groups / Firewall
Đảm bảo backend server cho phép traffic từ:
- **Local development**: IP của máy bạn
- **Vercel**: Tất cả IPs (0.0.0.0/0) hoặc chỉ IPs của Vercel

### 4. CORS Configuration
Backend cần cho phép requests từ:
- Local: `http://localhost:3000`
- Vercel: `https://your-vercel-app.vercel.app`

## 🧪 Kiểm tra cấu hình

### Test local:
```bash
# Tạo file .env.local
echo "NEXT_PUBLIC_API_BASE_URL=http://47.129.172.108:3000" > .env.local

# Chạy dev server
npm run dev

# Mở browser console và kiểm tra:
# - API calls có đúng URL không
# - Không có CORS errors
```

### Test trên Vercel:
1. Deploy lên Vercel với environment variable đã set
2. Mở browser console trên production site
3. Kiểm tra network requests:
   - URL phải là HTTPS
   - Không có CORS errors
   - API responses thành công

## 🔍 Troubleshooting

### Lỗi: "Failed to fetch" hoặc "Network error"
- Kiểm tra backend server có đang chạy không
- Kiểm tra firewall/security groups cho phép traffic
- Kiểm tra port có đúng không

### Lỗi: "Mixed Content" hoặc "Blocked by CORS"
- Đảm bảo backend URL sử dụng HTTPS trên production
- Kiểm tra CORS configuration trên backend
- Đảm bảo backend cho phép origin từ Vercel domain

### Lỗi: "SSL certificate error"
- Đảm bảo SSL certificate hợp lệ
- Kiểm tra domain name đã được cấu hình đúng
- Nếu dùng Let's Encrypt, đảm bảo certificate chưa hết hạn

