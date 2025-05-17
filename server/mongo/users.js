import { Schema, model } from "mongoose";

const UsersSchema = new Schema({
    login: String,
    password: String
});

export default model("users", UsersSchema);