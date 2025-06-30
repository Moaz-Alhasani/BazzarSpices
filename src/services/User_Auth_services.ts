class User_Auth_Services{


    public async google_auth_redirect(req: any, res: any): Promise<void> {
        res.redirect('http://localhost:3000/')
    }

    public async profilepage(req:any,res:any){
        res.render('Hello')
    }
}

export  const user_auth_services:User_Auth_Services=new User_Auth_Services();