import logging
import json


class JSONFormatter(logging.Formatter):
    def format(self,record):
        log_record={
            "timestamp":self.formatTime(record),
            "level":record.levelname,
            "message":record.getMessage(),
            "service":"logistics-app"
        }
        return json.dumps(log_record)
    

    def setup_logger():
        logger=logging.getLogger("logistics")
        handler=logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        return logger