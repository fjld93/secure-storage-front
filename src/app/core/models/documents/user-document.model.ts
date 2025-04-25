import { Metadata } from "./metadata.model";

export interface UserDocument {

    uuid: string;
    name: string;
    description: string;
    size?: number;
    createTime?: Date;
    updateTime?: Date;
    content?: File;
    metadata?: Metadata[];

}