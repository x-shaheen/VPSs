export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // إعداد الهيدرز لضمان أعلى أداء وحماية
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "X-Powered-By": "Cloudflare-Super-Server",
      "Cache-Control": "no-store" // لضمان جلب البيانات المحدثة دائماً من قاعدة البيانات
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1️⃣ واجهة برمجية لحفظ البيانات (POST /api/save)
    if (url.pathname === "/api/save" && request.method === "POST") {
      try {
        const body = await request.json();
        const { key, value } = body;

        if (!key || !value) {
          return new Response(JSON.stringify({ error: "Missing key or value" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // الحفظ في قاعدة البيانات KV المربوطة باسم MY_DATABASE
        await env.MY_DATABASE.put(key, JSON.stringify(value));

        return new Response(JSON.stringify({ status: "success", message: `Data saved under key: ${key}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // 2️⃣ واجهة برمجية لجلب البيانات (GET /api/get?key=NAME)
    if (url.pathname === "/api/get" && request.method === "GET") {
      const key = url.searchParams.get("key");
      if (!key) {
        return new Response(JSON.stringify({ error: "Parameter 'key' is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // جلب البيانات من KV
      const data = await env.MY_DATABASE.get(key);
      if (!data) {
        return new Response(JSON.stringify({ error: "Key not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ status: "success", key: key, data: JSON.parse(data) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3️⃣ الصفحة الرئسية التفاعلية مع الخادم (لوحة تحكم مصغرة)
    if (url.pathname === "/") {
      const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>لوحة تحكم الخادم السحابي</title>
          <style>
              body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
              .card { background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1); width: 90%; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
              h1 { color: #38bdf8; font-size: 1.8rem; text-align: center; margin-bottom: 20px; }
              input, button { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: none; font-size: 1rem; box-sizing: border-box; }
              input { background: #1e293b; color: white; border: 1px solid #475569; }
              button { background: #0284c7; color: white; font-weight: bold; cursor: pointer; transition: 0.2s; }
              button:hover { background: #0369a1; }
              .status { color: #10b981; font-weight: bold; text-align: center; margin-top: 15px; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1>🚀 خادمك السحابي الذكي ومخزن البيانات</h1>
              <input type="text" id="dbKey" placeholder="أدخل اسم المفتاح (Key)">
              <input type="text" id="dbValue" placeholder="أدخل القيمة المراد تخزينها (Value)">
              <button onclick="saveData()">حفظ البيانات في السحابة</button>
              <button onclick="getData()" style="background: #475569;">جلب البيانات من السحابة</button>
              <div id="output" class="status"></div>
          </div>

          <script>
              async function saveData() {
                  const key = document.getElementById('dbKey').value;
                  const value = document.getElementById('dbValue').value;
                  const res = await fetch('/api/save', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ key, value })
                  });
                  const result = await res.json();
                  document.getElementById('output').innerText = result.message || result.error;
              }

              async function getData() {
                  const key = document.getElementById('dbKey').value;
                  const res = await fetch('/api/get?key=' + key);
                  const result = await res.json();
                  if(result.status === 'success') {
                      document.getElementById('dbValue').value = result.data;
                      document.getElementById('output').innerText = "تم جلب البيانات بنجاح!";
                  } else {
                      document.getElementById('output').innerText = result.error;
                  }
              }
          </script>
      </body>
      </html>
      `;
      return new Response(html, { headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" } });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers: corsHeaders });
  }
};

