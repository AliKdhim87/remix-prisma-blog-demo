export const validateField = (fieldValue: string | FormDataEntryValue, fieldName: any) => {

    if (typeof fieldValue !== 'string' || fieldValue.length < 3) {
        return `${fieldName} should be at least 3 characters long`
    }
}