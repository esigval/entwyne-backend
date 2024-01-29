import prepareConcateFileText from "./preparingConcateFileLocal.js";
import prepareRenderingOrder from "./prepareRenderingOrder.js";
import editsFromStoryline from "./transformStorylineToEdits.js";

const editEngine = async (storylineId) => {
    await editsFromStoryline(storylineId); // Funcitonal Item
    const order = await prepareRenderingOrder (storylineId); // Gives Json File
    console.log(`order`, order);    
    await prepareConcateFileText(order); // Keep This
    

    return order;

};


export default editEngine;

