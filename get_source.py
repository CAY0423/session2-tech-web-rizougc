#!/bin/python
import os
import argparse

SOURCE_EXTENSIONS = {'.rs', '.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.scss', '.json'}

def collect_rust_files(directory, output_file):
    with open(output_file, 'w') as outfile:
        for root, dirs, files in os.walk(directory):
            for file in files:
                if any(file.endswith(ext) for ext in SOURCE_EXTENSIONS):
                    file_path = os.path.join(root, file)
                    outfile.write(f"---- {file_path} ----\n\n") 
                    with open(file_path, 'r') as infile:
                        outfile.write(infile.read())
                    outfile.write("\n\n") 

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect source files from a directory.")
    parser.add_argument("directory", help="The path to the source directory.")
    parser.add_argument("-o", "--output", default="source_code.txt", help="The output file (default: source_code.txt)")

    args = parser.parse_args()

    source_directory = args.directory
    output_file = args.output

    collect_rust_files(source_directory, output_file)
    print(f"Source code collected in {output_file}")