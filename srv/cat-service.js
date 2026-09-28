const { uuid, exists, isdir,read,mkdir } = cds.utils;
module.exports = cds.service.impl(async function () {

    const { EmployeeSrv } = this.entities;
    const { AddressSrv } =this.entities;
    const { ProductSrv,PurchaseItemSrv } = this.entities;
    const {PurchaseOrderSrv}=this.entities;
    

    // Implementation of an action
    // There are 3 generic handlers
    // .before() : Pre-check and validation
    // .on()     : Performing DB operations
    // .after()  : To save / close connections
    this.before('UPDATE',EmployeeSrv,async(request,response)=>{
        const salaryAmt = request.data.salaryAmount;
        if (salaryAmt > 100000){
            request.error(500,'Please get the approval from your line manager.');
        }
    })

    this.before('UPDATE',ProductSrv,async(request,response)=>{
        const price = request.data.PRICE;
        if (price > 5000){
            request.error(500,'Please get the approval from your line manager.');
        }
    })
    const cds = require('@sap/cds');

    this.before(['CREATE', 'UPDATE'], PurchaseItemSrv, async (req) => {

        const {
            GROSS_AMOUNT,
            CURRENCY_CODE,
            PO_ITEM_POS
        } = req.data;

        // Gross amount validation
        if (
            (CURRENCY_CODE === 'USD' && GROSS_AMOUNT > 50000) ||
            (CURRENCY_CODE === 'EUR' && GROSS_AMOUNT > 10000)
        ) {
            req.reject(
                400,
                'Gross amount exceeds the allowed limit. Please contact your line manager and region head.'
            );
        }

        // Purchase item position validation
        if (
            PO_ITEM_POS !== undefined &&
            PO_ITEM_POS !== null &&
            PO_ITEM_POS % 10 !== 0
        ) {
            req.reject(
                400,
                'Purchase item position must be a multiple of 10.'
            );
        }

});


// * Instance Bounded Action

    this.on('increaseSalary', async (request, response) => {
        try{
            const ID = request.params[0];
 
            const transaction = cds.tx(request);
 
            await transaction.update(EmployeeSrv).with({
                salaryAmount: {
                    '*=' : 1.15
                }
                }).where(ID);
 
                return await transaction.read(EmployeeSrv);
 
                const updatePrice = await transaction.read(EmployeeSrv)
 
                return updatePrice;
        }catch(error){
            return "Error : " + error.toString();
        }
    });

// Instance Bounded Function

    // BOUND FUNCTION
    // Get top 20 highest paid employees
    this.on('top20HighestPaidEmployees', EmployeeSrv, async (req) => {

        const employees = await SELECT
            .from(EmployeeSrv)
            .orderBy('salaryAmount desc')
            .limit(20);

        return employees;
    });
    // Utility Variables
this.on('getUtilities', async (request, response) => {
    let vUUID = uuid(), vPackageContent = null, vInput = "%E0%A4%A", uri, dirExists = false, isFileExists = false;

    // Exists
    if (exists('srv/request.http')) {
        isFileExists = true;
    }

    // Is directory exists or not
    if (isdir('app'))
    {
        dirExists = true;
    }

    // Decode URI
    try {
        uri = decodeURI(vInput);

        // Make Directory
        await mkdir('srv/lib')
    } catch {
        uri = vInput;
    }

    vPackageContent = await read('package.json');

    // Final Value
    var finalValue = {
        uuid: vUUID,
        uri: uri,
        isFileExists: isFileExists,
        dirExists: dirExists,
        packageInfo: vPackageContent
    }

    return finalValue;
});

// BOUND ACTION
    // Increase salary by 15%
    
    // this.before('UPDATE',Add, async (req) => {
    //     const { COUNTRY } = req.data;
 
    //     if (
    //         COUNTRY &&
    //         !['GB', 'US'].includes(COUNTRY.toUpperCase())
    //     ) {
    //         req.reject(
    //             400,
    //             'Country must be GB or US. Please contact your administrator.'
    //         );
    //     }
    // });
    // this.before('UPDATE', BusinessPartners, async (req) => {
    //     const { COMPANY_NAME } = req.data;
 
    //     if (
    //         COMPANY_NAME &&
    //         !/^[a-zA-Z0-9 ]+$/.test(COMPANY_NAME)
    //     ) {
    //         req.reject(
    //             400,
    //             'Company name must not contain special characters.'
    //         );
    //     }
    // });

    // this.on('createEmployee', async (request, response) => {

    //     // Step-2 : Get the data which is coming from the API
    //     const empData = request.data;
    //     // Step-3 : Instantiate the transaction object
    //     const objTransaction = cds.tx(request);

    //     // Step-4 : Insert the record into database
    //     let returnData = await objTransaction.run([
    //         INSERT.into(EmployeeSrv).entries(empData)
    //     ]).then((resolve, reject) => {

    //         if (typeof (resolve) !== undefined) {
    //             return request.data;
    //         } else {
    //             request.error(500, "Error in inserting data into the database");
    //         }

    //     }).catch(err => {
    //         request.error("There is an error : ", err.toString());
    //     });

    //     // Step-5 : Return the data
    //     return request.data;

    // });
    this.on('createAddress', async (request, response) => {

    // Step-2 : Get the data which is coming from the API
    const addressData = request.data;

    // Step-3 : Instantiate the transaction object
    const objTransaction = cds.tx(request);

    // Step-4 : Insert the record into database
    let returnData = await objTransaction.run([
        INSERT.into(AddressSrv).entries(addressData)
    ]).then((resolve, reject) => {

        if (typeof (resolve) !== undefined) {
            return request.data;
        } else {
            request.error(
                500,
                "Error in inserting address data into the database"
            );
        }

    }).catch(err => {
        request.error(
            "There is an error : ",
            err.toString()
        );
    });

    // Step-5 : Return the data
    return returnData;
    });
    this.on('updateEmployee', async (request, response) => {

    const {
        ID,
        salaryAmount,
        Currency_code
    } = request.data;

    try {
        const objTransaction = cds.tx(request);

        await objTransaction.update(EmployeeSrv).with({
            salaryAmount: salaryAmount,
            Currency_code: Currency_code
        }).where({
            ID: ID
        });

        return "Successfully updated.";

    } catch (error) {
        request.error("Error : ", error);
    }

    })
    this.on('updateAddress', async (request, response) => {

    const {
        NODE_KEY,
        CITY
    } = request.data;

    try {
        const objTransaction = cds.tx(request);

        await objTransaction.update(AddressSrv).with({
            CITY: CITY
        }).where({
            NODE_KEY: NODE_KEY
        });

        return "Successfully updated.";

    } catch (error) {
        request.error("Error : ", error);
    }

    });
    this.on('createProduct', async (request, response) => {

    // Step-2 : Get the data which is coming from the API
    const productData = request.data;

    // Step-3 : Instantiate the transaction object
    const objTransaction = cds.tx(request);

    // Step-4 : Insert the record into database
    let returnData = await objTransaction.run([
        INSERT.into(ProductSrv).entries(productData)
    ]).then((resolve, reject) => {

        if (typeof (resolve) !== undefined) {
            return request.data;
        } else {
            request.error(
                500,
                "Error in inserting product data into the database"
            );
        }

    }).catch(err => {
        request.error(
            "There is an error : ",
            err.toString()
        );
    });

    // Step-5 : Return the data
    return returnData;
    });
    this.on('updateProductPrice', async (request, response) => {

    const {
        NODE_KEY,
        PRICE
    } = request.data;

    try {
        const objTransaction = cds.tx(request);

        await objTransaction.update(ProductSrv).with({
            PRICE: PRICE
        }).where({
            NODE_KEY: NODE_KEY
        });

        return "Product price successfully updated.";

    } catch (error) {
        console.error(error);
        request.error(500, error.message);
    }

    });
    this.on('deleteEmployee', async (request, response) => {

    const {
        ID
    } = request.data;

    try {
        const objTransaction = cds.tx(request);

        await objTransaction.delete(EmployeeSrv).where({
            ID: ID
        });

        return "Successfully deleted.";

    } catch (error) {
        request.error("Error : ", error);
    }

    })
    // Implementation of custom function
this.on('getHighestSalariedEmployees', async (request, response) => {
    try {
        // Step - 1 : Create an object for the transaction
        const transaction = cds.tx(request);

        // Step - 2 : Get salaries of an employee using Transaction object
        const response = await transaction.read(EmployeeSrv).orderBy({
            salaryAmount: 'desc'
        }).limit(10);

        // Step - 3 : Display the employee salaries
        return response;

    } catch (error) {
        request.error("Error : ", error);
    }
})
// Implementation of custom function
this.on('getHeighestPricedProduct', async (request, response) => {
    try {
        // Step - 1 : Create an object for the transaction
        const transaction = cds.tx(request);

        // Step - 2 : Get highest priced product
        const response = await transaction.read(ProductSrv).orderBy({
            PRICE: 'desc'
        }).limit(1);

        // Step - 3 : Display the highest priced product
        return response;

    } catch (error) {
        request.error("Error : ", error);
    }
})
this.on('discountPrice', async (request, response) => {
    try {
        // Step-1 : Get the parameter form the entity
        const ID = request.params[0];

        // Step-2 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        // Step-3 : Update the purchase order service
        await transaction.update(PurchaseOrderSrv).with({
            GROSS_AMOUNT: {
                '-=': 1000
            },
            NET_AMOUNT: {
                '-=': 800
            },
            TAX_AMOUNT: {
                '-=': 200
            }
        }).where(ID)

        const updatePOInfo = await transaction.read(PurchaseOrderSrv);

        return updatePOInfo;
    } catch (error) {
        return "Error : " + error.toString();
    }
})
this.on('largestOrder', async (request, response) => {
    try {

        // Step-2 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        const reply = await transaction.read(PurchaseOrderSrv).orderBy({
            GROSS_AMOUNT: 'desc'
        }).limit(5);

        return reply;
    } catch (error) {
        return "Error : " + error.toString();
    }
})
this.on('increasePrice', async (request) => {
    try {
 
        const { NODE_KEY } = request.params[0];
 
        const transaction = cds.tx(request);
 
        const product = await transaction.read(ProductSrv)
            .where({ NODE_KEY });
 
        if (!product.length) {
            return request.error(404, "Product not found");
        }
 
        const newPrice = Number(product[0].PRICE) * 1.10;
 
        await transaction.update(ProductSrv)
            .with({
                PRICE: newPrice
            })
            .where({ NODE_KEY });
 
        const updatedProductPrice = await transaction.read(ProductSrv)
            .where({ NODE_KEY });
 
        return updatedProductPrice;
 
    } catch (error) {
        return "Error : " + error.toString();
    }
});
 
this.on('top_20_product', ProductSrv, async (request) => {
    try {
 
        const transaction = cds.tx(request);
 
        const products = await transaction.read(ProductSrv)
            .orderBy('PRICE desc')
            .limit(20);
 
        return products;
 
    } catch (error) {
        return request.error(500, "Error : " + error.toString());
    }
});
    

});