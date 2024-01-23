import renderingOrder from "./renderingOrder.js";

const prepareRenderingOrder = async (storylineId) => {
    const order = await renderingOrder(storylineId);
    const json = order;

    // Assign the JSON string to the output variable
    return json;
};

export default prepareRenderingOrder;