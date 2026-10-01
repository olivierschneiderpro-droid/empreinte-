import sys,importlib
sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
import lum
for m in sys.argv[1:]: importlib.import_module(m)
lum.write_all()
print(' '.join(lum.SCREENS))
