const httpAPI = (path) => new Promise((resolve) => {
  $httpAPI("GET", path, null, (result) => resolve(result));
});

(async () => {
  try {
    const res = await httpAPI("/v1/requests/recent");
    const arr = Array.isArray(res) ? res : (res && res.requests ? res.requests : []);
    const matches = arr.filter((r) => {
      const s = [r.URL, r.url, r.host, r.address, r.remoteAddress]
        .filter(Boolean).join(" ");
      return /192\.168\.(10|20|30|60)\./.test(s);
    });
    if (!matches.length) {
      $done({
        title: "Home Route",
        content: "最近没有 192.168.x 请求\n先打开 http://192.168.20.1"
      });
      return;
    }
    const r = matches[0];
    const target = r.URL || r.url || r.host || r.address || "?";
    const policy = r.policy || r.policyName || "-";
    const rule = r.rule || r.ruleName || "-";
    $done({
      title: "Home Route",
      content: target + "\n策略: " + policy + "\n规则: " + rule
    });
  } catch (e) {
    $done({ title: "Home Route", content: "读取失败: " + e });
  }
})();
