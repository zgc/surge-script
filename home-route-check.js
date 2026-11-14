const httpAPI = (path) => new Promise((resolve, reject) => {
  try {
    $httpAPI("GET", path, null, (result) => resolve(result));
  } catch (e) {
    reject(e);
  }
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
        title: "Home Route Check",
        content: "最近没有 192.168.x 请求\n先打开当前家的路由器页面，例如 http://192.168.60.1"
      });
      return;
    }
    const r = matches[0];
    const target = r.URL || r.url || r.host || r.address || "?";
    const policy = r.policy || r.policyName || "-";
    const rule = r.rule || r.ruleName || "-";
    $done({
      title: "Home Route Check",
      content: target + "\n策略: " + policy + "\n规则: " + rule,
      icon: "house",
      "icon-color": "#5A9AF9"
    });
  } catch (e) {
    $done({
      title: "Home Route Check",
      content: "读取失败: " + e,
      icon: "exclamationmark.triangle",
      "icon-color": "#FF9F0A"
    });
  }
})();
