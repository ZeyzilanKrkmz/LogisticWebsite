from fastapi import Requests
from fastapi.responses import JSONResponse

class LogisticBaseException(Exception):
    def __init__(self,message:str,status_code:int=400):
        self.message=message
        self.status_code=status_code

    async def global_exception_handler(requests:Requests,exc:LogisticBaseException):        
        return JSONResponse(
            status_code=exc.status_code,
            content={"status":False,"error_code":exc.status_code,"message":exc.message},
            
        )
