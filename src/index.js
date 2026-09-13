export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // إعداد الهيدرز لضمان أعلى أداء وتوافقية وسرعة (CORS & Security)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "X-Powered-By": "Cloudflare-Super-Server",
      "Cache-Control": "public, max-age=3600" // كاش تلقائي لمدة ساعة لزيادة السرعة الخارقة
    };

    // التعامل مع طلبات التحقق المسبق (Preflight Requests) لـ CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // مسار افتراضي لعرض صفحة الخادم بنجاح
    if (url.pathname === "/") {
      const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>الخادم السحابي الخارق</title>
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; text-align: center; padding: 50px; margin: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
              .card { background: rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
              h1 { color: #38bdf8; font-size: 2.5rem; margin-bottom: 10px; }
              p { color: #94a3b8; font-size: 1.2rem; }
              .status { display: inline-block; background: #10b981; color: white; padding: 5px 15px; border-radius: 50px; font-weight: bold; font-size: 0.9rem; margin-top: 15px; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1>🚀 خادمك السحابي يعمل بنجاح!</h1>
              <p>مستضاف بالكامل على منصة Cloudflare العالمية بمواصفات خارقة سرعة استجابة مذهلة.</p>
              <div class="status">متصل ونشط (Online)</div>
          </div>
      </body>
      </html>
      `;
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    // مسار API لاختبار أداء الخادم وجلب بيانات ومعلومات الاتصال فوراً
    if (url.pathname === "/api/status") {
      const serverData = {
        status: "success",
        message: "Welcome to your high-performance Cloudflare Serverless Cloud",
        timestamp: new Date().toISOString(),
        features: ["Global Edge Deployment", "Auto Scaling", "DDoS Protection", "Instant Response Time"],
        client_info: {
          ip: request.headers.get("cf-connecting-ip") || "Unknown",
          country: request.headers.get("cf-ipcountry") || "Unknown",
          user_agent: request.headers.get("user-agent") || "Unknown"
        }
      };
      return new Response(JSON.stringify(serverData, null, 2), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // في حال طلب مسار غير موجود
    return new Response(JSON.stringify({ error: "Not Found", status: 404 }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

