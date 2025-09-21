

import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, Supplier, SupplierSuggestion } from "../types";

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


export const generateSupplierSuggestions = async (suppliers: Supplier[], items: InventoryItem[]): Promise<SupplierSuggestion[] | { error: string }> => {
    if (!process.env.API_KEY) {
        return { error: "Lỗi: Khóa API chưa được cấu hình. Vui lòng đặt biến môi trường API_KEY." };
    }

    const inventoryByCategory = items.reduce((acc, item) => {
        const category = item.name.includes("Laptop") ? "Laptop" :
                         item.name.includes("Bàn phím") || item.name.includes("Chuột") ? "Phụ kiện máy tính" :
                         item.name.includes("Màn hình") ? "Màn hình" :
                         item.name.includes("Tai nghe") || item.name.includes("Microphone") ? "Thiết bị âm thanh" :
                         item.name.includes("Ghế") || item.name.includes("Bàn") ? "Nội thất văn phòng" : "Linh kiện khác";
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category]++;
        return acc;
    }, {} as Record<string, number>);

    const supplierInfo = suppliers.map(s => ({
        name: s.name,
        rating: s.rating,
        productsSupplied: s.productsSupplied,
    }));

    const prompt = `
        Bạn là một chuyên gia tìm nguồn cung ứng và quản lý chuỗi cung ứng tại thị trường Việt Nam.
        Dựa trên dữ liệu về nhà cung cấp hiện tại và danh sách hàng tồn kho dưới đây, hãy đề xuất 3 nhà cung cấp tiềm năng mới.

        Mục tiêu:
        - Đa dạng hóa nguồn cung.
        - Tìm nhà cung cấp cho các danh mục sản phẩm chưa có nhiều lựa chọn.
        - Tìm các lựa chọn thay thế cho nhà cung cấp có đánh giá thấp (dưới 4 sao).

        Dữ liệu nhà cung cấp hiện tại:
        ${JSON.stringify(supplierInfo, null, 2)}

        Số lượng sản phẩm theo danh mục trong kho:
        ${JSON.stringify(inventoryByCategory, null, 2)}

        Yêu cầu đầu ra:
        Cung cấp một danh sách JSON chứa 3 nhà cung cấp được đề xuất. Với mỗi nhà cung cấp, hãy bao gồm các trường: 'name', 'specialty', và 'reason'.
        - Tên nhà cung cấp (bịa tên nếu cần, nhưng phải hợp lý với thị trường Việt Nam, ví dụ: 'VNLink Components', 'Saigon Ergonomics').
        - Lĩnh vực chuyên môn (ví dụ: "Linh kiện máy tính cao cấp", "Nội thất văn phòng công thái học").
        - Lý do đề xuất (giải thích ngắn gọn tại sao nhà cung cấp này là một lựa chọn tốt dựa trên dữ liệu đã cho, ví dụ: "Để bổ sung nguồn cung cho danh mục 'Thiết bị âm thanh' hiện chỉ có một nhà cung cấp SoundWave với đánh giá 3 sao").

        Vui lòng trả lời bằng tiếng Việt.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "A list of suggested suppliers.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { 
                                        type: Type.STRING,
                                        description: "The name of the suggested supplier."
                                    },
                                    specialty: { 
                                        type: Type.STRING,
                                        description: "The specialty area of the supplier."
                                     },
                                    reason: { 
                                        type: Type.STRING,
                                        description: "The reason for suggesting this supplier."
                                    }
                                },
                                required: ['name', 'specialty', 'reason']
                            }
                        }
                    },
                    required: ['suggestions']
                }
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.suggestions || [];
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        return { error: "Đã xảy ra lỗi khi tạo gợi ý. Vui lòng thử lại sau." };
    }
};