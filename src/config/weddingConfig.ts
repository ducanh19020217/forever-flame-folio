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
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export const allImages = [
    { src: gallery1, alt: "Wedding bouquet" },
    { src: gallery2, alt: "Wedding rings" },
    { src: gallery3, alt: "Reception table" },
    { src: gallery4, alt: "Wedding cake" },
    { src: gallery1, alt: "Wedding bouquet" },
    { src: gallery2, alt: "Wedding rings" },
    { src: gallery3, alt: "Reception table" },
    { src: gallery4, alt: "Wedding cake" },
    { src: gallery1, alt: "Wedding bouquet" },
    { src: gallery2, alt: "Wedding rings" },
    { src: gallery3, alt: "Reception table" },
    { src: gallery4, alt: "Wedding cake" },
    { src: gallery1, alt: "Wedding bouquet" },
    { src: gallery2, alt: "Wedding rings" },
    { src: gallery3, alt: "Reception table" },
    { src: gallery4, alt: "Wedding cake" },
    { src: gallery1, alt: "Wedding bouquet" },
    { src: gallery2, alt: "Wedding rings" },
    { src: gallery3, alt: "Reception table" },
    { src: gallery4, alt: "Wedding cake" },
    { src: gallery1, alt: "Wedding bouquet" },
    { src: gallery2, alt: "Wedding rings" },
    { src: gallery3, alt: "Reception table" },
    { src: gallery4, alt: "Wedding cake" },
    // thêm các ảnh khác vào đây
];
