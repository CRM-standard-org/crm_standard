export function decodeString(encodedString: string) {
  // แปลงจากรูปแบบที่ผิดไปเป็น UTF-8
  const bytes = [];
  for (let i = 0; i < encodedString.length; i++) {
    bytes.push(encodedString.charCodeAt(i));
  }
  // สร้าง Uint8Array จาก bytes
  const uint8Array = new Uint8Array(bytes);
  // แปลงกลับเป็น string
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(uint8Array);
}
