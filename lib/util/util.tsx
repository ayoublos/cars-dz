function stringField(formData: FormData, key: string): string {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  }
  
  function numberField(formData: FormData, key: string, fallback: number): number {
    const v = formData.get(key);
    if (typeof v !== "string" || v === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }