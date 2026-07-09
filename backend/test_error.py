import sys
sys.path.append('d:/Najeeb_repos/fastapiapp/backend')
from services.resume_service import analyse_resume
import traceback
try:
    print(analyse_resume('test'))
except Exception as e:
    traceback.print_exc()
