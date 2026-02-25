import Counter from "../models/counterModel.js";

export const getNextOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { new: true, upsert: true },
  );
  const date = new Date();

  return `ORD-${date.getTime()}-${String(counter.value).padStart(4, "0")}`;
};
