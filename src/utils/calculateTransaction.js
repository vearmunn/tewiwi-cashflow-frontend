export default function (data, type) {
    return data.reduce(
        (acc, item) =>
            item.category_type === type
                ? acc + Number(item.amount)
                : acc,
        0
    );
}