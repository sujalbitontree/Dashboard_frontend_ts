import { SignupInput, signupSchema } from "./signupValidation";

export const validateField = async (name: keyof SignupInput , value : string,allFormData: SignupInput)=>{
   try {
    const dataTovalidate = {...allFormData,[name]:value}
    await signupSchema.validateAt(name,dataTovalidate)
    return ""
   } catch (error : any) {
    return error.message
   }
}