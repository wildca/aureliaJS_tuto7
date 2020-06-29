export interface Article {
    readonly author: string;
    readonly feedId: number;
    readonly feedTitle: string;
    readonly id: number;
    readonly isRead: boolean;
    readonly isFavorite: boolean;
    readonly link: string;
    readonly title: string;
    readonly updatedAt: Date;
}
