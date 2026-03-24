import os
import re

def replace_in_files(directory):
    # Matches words like bg-blue-500, text-blue-600, border-blue-400, ring-blue-500, etc.
    # Also hover:bg-blue-600, etc.
    pattern = re.compile(r'\b(bg|text|border|ring|divide)-blue-(\d+)\b')
    pattern_hover = re.compile(r'\b(hover:bg|hover:text|hover:border|focus:ring|focus:border|active:bg)-blue-(\d+)\b')
    
    # We will also change badge-blue to badge-sage or keep badge-blue but defined in index.css as sage.
    # Actually, we should just let the regex catch the primary tailwind classes.

    count_files_modified = 0
    count_replacements = 0

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Perform replacement
                new_content = pattern.sub(r'\1-emerald-\2', content)
                new_content = pattern_hover.sub(r'\1-emerald-\2', new_content)
                
                # Also replace arbitrary blue texts where it matters like text-blue
                new_content = new_content.replace('badge-blue', 'badge-sage')
                new_content = new_content.replace('bg-blue-50', 'bg-emerald-50')
                new_content = new_content.replace('text-blue-600', 'text-emerald-600')

                # Some specific overrides to amber (gold) if there are any specific highlights we want, but emerald is fine for now globally.
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count_files_modified += 1
                    # count approx diff
                    count_replacements += len(content) - len(new_content) # just an indicator

    print(f"Modified {count_files_modified} files.")

if __name__ == '__main__':
    src_dir = os.path.join(os.path.dirname(__file__), 'src')
    replace_in_files(src_dir)
