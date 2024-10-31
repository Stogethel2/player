export interface Logo {
    type: 'text' | 'img';
    value?: string;
}

export interface menuItem {
    label: string,
    path: string
}
export interface menuSetting {
    menu: menuItem[];
}
export interface brandSetting {
    logo: Logo;
}
export interface announceSetting {
    announcement: string;
}