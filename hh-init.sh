#!/bin/bash

# Remove existing contracts and test directories if they exist
rm -rf contracts test

# Create contracts and test directories
mkdir -p contracts test

# Function to create symlinks for contract files, excluding node_modules
create_contract_symlinks() {
    find . -type f -name "*.sol" \
        ! -path "./contracts/*" \
        ! -path "./node_modules/*" \
        ! -path "*/node_modules/*" \
        ! -path "./test/*" \
        -print0 | while IFS= read -r -d '' file; do
        # Remove leading './' from file path
        relative_path="${file#./}"
        # Create the symlink path in contracts directory
        link_path="./contracts/$relative_path"
        # Create the directory structure in contracts directory
        mkdir -p "$(dirname "$link_path")"
        # Create the symlink
        ln -sf "$(realpath "$file")" "$link_path"
    done
}

# Function to create symlinks for test files inside 'test' directories, excluding node_modules
create_test_symlinks() {
    find . -type f \( -name "*Test.ts" -o -name "*test.ts" \) \
        -path "*/test/*" \
        ! -path "./test/*" \
        ! -path "*/node_modules/*" \
        -print0 | while IFS= read -r -d '' file; do
        # Remove leading './' from file path
        relative_path="${file#./}"
        # Create the symlink path in test directory
        link_path="./test/$relative_path"
        # Create the directory structure in test directory
        mkdir -p "$(dirname "$link_path")"
        # Create the symlink
        ln -sf "$(realpath "$file")" "$link_path"
    done
}

# Create symlinks for contract files
create_contract_symlinks

# Create symlinks for test files
create_test_symlinks

echo "Symlinks created successfully!"
