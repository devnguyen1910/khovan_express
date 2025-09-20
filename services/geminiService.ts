
import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateInventorySummary = async (items: InventoryItem[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Lỗi: Khóa API chưa được cấu hình. Vui lòng đặt biến môi trường API_KEY.";
  }

  const simplifiedData = items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    location: item.location,
  }));

  const prompt = `
    Bạn là một chuyên gia quản lý kho vận. Dựa vào dữ liệu tồn kho sau đây (định dạng JSON), hãy viết một bản tóm tắt tình hình kho hàng bằng tiếng Việt.
    Báo cáo cần bao gồm các điểm sau:
    1.  Đánh giá chung về tổng số lượng hàng tồn kho.
    2.  Liệt kê các mặt hàng sắp hết hàng (số lượng dưới 10).
    3.  Liệt kê các mặt hàng có số lượng tồn kho lớn (số lượng trên 200).
    4.  Nhận xét về sự phân bổ hàng hóa tại các vị trí kho khác nhau.
    5.  Đưa ra một đề xuất hành động ngắn gọn (ví dụ: "Cần nhập thêm hàng X", "Xem xét khuyến mãi cho mặt hàng Y").

    Dữ liệu tồn kho:
    ${JSON.stringify(simplifiedData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    return "Đã xảy ra lỗi khi tạo báo cáo tóm tắt. Vui lòng thử lại sau.";
  }
};
