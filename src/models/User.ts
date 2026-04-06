import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
  VIEWER = 'VIEWER',
  ANALYST = 'ANALYST',
  ADMIN = 'ADMIN',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  status: Status;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.VIEWER,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure JSON responses don't include the password
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete (ret as any).password;
    delete (ret as any).__v;
    return ret;
  },
});

export default mongoose.model<IUser>('User', UserSchema);
