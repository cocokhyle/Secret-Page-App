import { supabase } from "@/lib/supabase";

export const getMessages = async (userId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data;
};

export const addMessage = async (userId: string, content: string) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({ user_id: userId, content });

  if (error) throw new Error(error.message);
  return data;
};

export const addFriend = async (userId: string, friendId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .insert({ user_id: userId, friend_id: friendId });

  if (error) throw new Error(error.message);
  return data;
};
