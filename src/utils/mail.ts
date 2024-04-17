import { MAILTRAP_PASS, MAILTRAP_USER, SIGN_IN_URL, VERIFICATION_EMAIL, PASSWORD_RESET_LINK, MAILTRAP_TOKEN, ORDER_EMAIL } from '#/utils/variables';
import nodemailer from 'nodemailer';
import { MailtrapClient } from "mailtrap";
import { generateTemplate } from "#/mail/template";

const ENDPOINT = "https://send.api.mailtrap.io/";

const generateMailTransporter = () =>{
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASS
        }
      });
      return transport
}

// interface Profile{
//     name: string;
//     email: string;
//     userId: string;
// }


 interface Options{
    email: string;
    link: string;
}

// interface MailtrapClientConfig {
//   endpoint: string;
//   token: string;
// }

export const sendForgetPasswordLink = async (options: Options) =>{ 
  const { email, link } = options
    const ENDPOINT = 'your-endpoint'; // Define your endpoint

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: MAILTRAP_TOKEN });
  
  const sender = {
    email: VERIFICATION_EMAIL,
    name: "Password Reset", 
  }; 
  const recipients = [
    {
      email
    }
  ];
  
  client   
    .send({
      from: sender,
      to: recipients,
      template_uuid: "f442222c-5b7f-4c31-93c6-d8d9e6bd86a4",
      template_variables: {
        "user_email": email,
        "pass_reset_link": link
      }
    })
  }

  
export const sendPasswordResetMail = async (name: string, email: string) =>{ 

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: MAILTRAP_TOKEN });
  
  const sender = {
    email: VERIFICATION_EMAIL,
    name: "Password Reset", 
  }; 

  const recipients = [
    {
      email
    }
  ];
  
  client   
  .send({
    from: sender,
    to: recipients,
    template_uuid: "bc872ac3-eeb3-4bb8-95b2-c3bd08ea392f",
    template_variables: {
      "user_name": name,
      "user_email": email
    }
  })

}

  export const productOrderMail = async (name:string, email:string, product: string, quantity: number, price: number, address: string, transactionId: string) =>{ 
    const client = new MailtrapClient({ endpoint: ENDPOINT, token: MAILTRAP_TOKEN });
  
    const sender = {
      email: ORDER_EMAIL,
      name: "Lafresh Order", 
    }; 
  
    const recipients = [
      {
        email
      }
    ];
    
    client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "7039b7be-226b-423f-bfb3-76a209ed56d9",
    template_variables: {
      "name": name,
      "product": product,
      "price": price,
      "email": email,
      "quantity": quantity,
      "addess": address,
      "transactionId": transactionId,
    }
  })

    // const transport = generateMailTransporter()
      
    //   const message = `Dear ${name} we just updated your password. You can now sign in with your new password.`;
      
    //     transport.sendMail({
    //       to: email,
    //       from: VERIFICATION_EMAIL,
    //       subject: "Password Reset Succesfully",
    //       html: generateTemplate({
    //           title: 'Product Order',
    //           message,
    //           logo: "cid:logo",
    //           banner: "cid:forget_password",
    //           link: SIGN_IN_URL,
    //           btnTitle: "Login" 
    //       }),
    //       attachments: [
    //           {
    //               filename: "logo.png",
    //               path: path.join(__dirname, "../mail/logo.png"),
    //               cid: "logo"
    //           },
    //           {
    //               filename: "forget_password.png",
    //               path: path.join(__dirname, "../mail/forget_password.png"),
    //               cid: "forget_password"
    //           },
    //       ]
    //     })
  }
  
  