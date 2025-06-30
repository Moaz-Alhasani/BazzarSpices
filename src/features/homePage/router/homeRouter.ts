import express,{Request,Response} from'express'
import path from"path"
import { vrefiyUser } from '../../../globals/middlware/auth.middlware';
const mainrouter=express.Router();

mainrouter.get('/', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'static', 'index.html');
  res.sendFile(filePath);
});
export default mainrouter