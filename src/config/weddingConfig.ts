export type WeddingSide = "bride" | "groom" | "friends";

export interface WeddingTimelineItem {
    time: string;   // "08:00"
    title: string;  // "Dùng tiệc thân mật"
}

export interface WeddingVariant {
    inviteHeading: string;   // "Trân trọng kính mời"
    inviteIntro: string;     // "đến dự Lễ Vu Quy của"
    groomName: string;
    brideName: string;
    themeColor: string;      // màu chủ đạo cho role
    labelForDay: string;     // ví dụ "Lễ Vu Quy & Tiệc tại nhà gái"
    timeline: WeddingTimelineItem[]; // danh sách {time, title}
}

export const weddingConfig: Record<WeddingSide, WeddingVariant> = {
    bride: {
        inviteHeading: "Trân trọng kính mời",
        inviteIntro: "đến dự Lễ Vu Quy của",
        groomName: "Đức Ánh",
        brideName: "Hà Phương",
        themeColor: "rgb(150,62,80)",
        labelForDay: "Lễ Vu Quy & Tiệc tại nhà gái",
        timeline: [
            {time: "08:00", title: "Dùng tiệc"},
            {time: "10:00", title: "Lễ đón dâu"},
            {time: "11:00", title: "Lễ Vu Quy"},
        ],
    },

    groom: {
        inviteHeading: "Trân trọng kính mời",
        inviteIntro: "đến dự Lễ Thành Hôn của",
        groomName: "Đức Ánh",
        brideName: "Hà Phương",
        themeColor: "rgb(120,40,50)",
        labelForDay: "Lễ Thành Hôn & Tiệc tại nhà trai",
        timeline: [
            {time: "08:00", title: "Dùng tiệc"},
            {time: "10:00", title: "Rước dâu"},
            {time: "11:00", title: "Lễ Thành Hôn"},
        ],
    },

    friends: {
        inviteHeading: "Trân trọng kính mời",
        inviteIntro: "đến chung vui cùng chúng tôi",
        groomName: "Đức Ánh",
        brideName: "Hà Phương",
        themeColor: "rgb(150,62,80)",
        labelForDay: "Lịch ngày cưới",
        timeline: [
            {time: "08:00", title: "Dùng tiệc"},
            {time: "10:00", title: "Đón dâu"},
            {time: "11:00", title: "Lễ cưới"},
        ],
    },
};

export const brideShortName = "Hà Phương";
export const brideFullName = "Bùi Thị Hà Phương";
export const groomShortName = "Đức Ánh";
export const groomFullName = "Đàm Đức Ánh";
export const weddingDate = "07.12.2025";
export const weddingTime = "2025-12-07T10:00:00";
export const quote = "Tình yêu là hành trình đẹp nhất của cuộc đời";
export const brideBank = "Techcombank";
export const brideBankAccount = "00000000000000";
export const groomBank = "Techcombank";
export const groomBankAccount = "00000000000000";

// ✅ Bạn có thể import nhiều ảnh nặng tại đây
import A1 from "@/assets/A1.jpg";
import A2 from "@/assets/A2.jpg";
import A3 from "@/assets/A3.jpg";
import A4 from "@/assets/A4.jpg";
import A5 from "@/assets/A5.jpg";
import A6 from "@/assets/A6.jpg";
import A7 from "@/assets/A7.jpg";
import A8 from "@/assets/A8.jpg";
import A9 from "@/assets/A9.jpg";
import A10 from "@/assets/A10.jpg";
import A11 from "@/assets/A11.jpg";
import A12 from "@/assets/A12.jpg";
import A13 from "@/assets/A13.jpg";
import A14 from "@/assets/A14.jpg";



export const allImages = [
    { src: A13, alt: "Wedding Image" },
    { src: A2, alt: "Wedding Image" },
    { src: A14, alt: "Wedding Image" },
    { src: A3, alt: "Wedding Image" },
    { src: A1, alt: "Wedding Image" },
    { src: A5, alt: "Wedding Image" },
    { src: A9, alt: "Wedding Image" },

    { src: A6, alt: "Wedding Image" },
    { src: A7, alt: "Wedding Image" },
    { src: A8, alt: "Wedding Image" },
    { src: A4, alt: "Wedding Image" },
    { src: A10, alt: "Wedding Image" },
    { src: A11, alt: "Wedding Image" },
    { src: A12, alt: "Wedding Image" },
    // thêm các ảnh khác vào đây
];
