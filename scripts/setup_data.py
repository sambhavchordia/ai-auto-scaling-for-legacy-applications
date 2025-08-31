# ai-autoscaling-system/scripts/setup_data.py
#!/usr/bin/env python3
"""
Data Setup Script

Moves datasets from root directory to project data folder and sets up the environment.
"""

import os
import shutil
import sys
from pathlib import Path

def setup_data():
    """Setup data files in the correct location"""
    print("🔧 Setting up data files...")
    
    # Get current directory
    current_dir = Path(__file__).parent.parent
    data_dir = current_dir / "data"
    
    # Ensure data directory exists
    data_dir.mkdir(exist_ok=True)
    
    # Files to move from root to data directory (if they exist there)
    files_to_move = [
        "yearly_synthetic_dataset_with_scaling.csv",
        "system-10_with_binned_instances.csv"
    ]
    
    for file_name in files_to_move:
        source_path = current_dir.parent / file_name
        dest_path = data_dir / file_name
        
        if source_path.exists() and not dest_path.exists():
            print(f"📁 Moving {file_name} to data directory...")
            shutil.copy2(source_path, dest_path)
            print(f"✅ Successfully moved {file_name}")
        elif dest_path.exists():
            print(f"✅ {file_name} already exists in data directory")
        else:
            print(f"⚠️  Warning: {file_name} not found in root directory")
    
    # Create sample data if it doesn't exist
    sample_data_path = data_dir / "sample_data.csv"
    if not sample_data_path.exists():
        print("📝 Creating sample_data.csv...")
        create_sample_data(sample_data_path)
        print("✅ Created sample_data.csv")
    
    # Create logs directory
    logs_dir = current_dir / "logs"
    logs_dir.mkdir(exist_ok=True)
    gitkeep_path = logs_dir / ".gitkeep"
    if not gitkeep_path.exists():
        gitkeep_path.touch()
        print("✅ Created logs directory with .gitkeep")
    
    print("🎉 Data setup complete!")

def create_sample_data(file_path):
    """Create sample data file"""
    sample_data = """timestamp,cpu_usage,memory_usage,network_io,disk_io,user_count,response_time,error_rate,load_1m,load_5m,load_15m
2024-01-01 00:00:00,45.2,67.8,1024.5,256.3,150,120,0.02,0.45,0.42,0.38
2024-01-01 00:01:00,48.1,69.2,1156.7,289.1,165,135,0.01,0.48,0.45,0.41
2024-01-01 00:02:00,52.3,71.5,1289.3,312.7,180,142,0.03,0.52,0.49,0.44
2024-01-01 00:03:00,55.7,73.8,1423.8,345.2,195,148,0.02,0.56,0.52,0.47
2024-01-01 00:04:00,58.9,76.1,1567.4,378.9,210,155,0.01,0.59,0.55,0.50
2024-01-01 00:05:00,61.2,78.4,1701.2,412.5,225,162,0.02,0.61,0.58,0.53
2024-01-01 00:06:00,64.5,80.7,1834.8,445.8,240,168,0.01,0.65,0.61,0.56
2024-01-01 00:07:00,67.8,82.9,1968.5,479.2,255,175,0.03,0.68,0.64,0.59
2024-01-01 00:08:00,71.1,85.2,2102.1,512.6,270,182,0.02,0.71,0.67,0.62
2024-01-01 00:09:00,74.4,87.5,2235.7,545.9,285,188,0.01,0.74,0.70,0.65"""
    
    with open(file_path, 'w') as f:
        f.write(sample_data)

if __name__ == "__main__":
    setup_data()
