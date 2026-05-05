"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteResult } from "@/services/result";

export const DeleteDuplicatesSection = ({ results, loadResults }) => {
  const [finding, setFinding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [status, setStatus] = useState(null);

  const findDuplicates = async () => {
    setFinding(true);
    setStatus(null);
    
    try {
      // Group by game + date
      const grouped = {};
      
      results.forEach(result => {
        const key = `${result.game}-${result.date}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(result);
      });

      // Find groups with duplicates
      const duplicateGroups = Object.entries(grouped)
        .filter(([_, results]) => results.length > 1)
        .map(([key, results]) => ({
          key,
          game: results[0].game,
          date: results[0].date,
          records: results,
          count: results.length
        }));

      setDuplicates(duplicateGroups);
      
      if (duplicateGroups.length === 0) {
        setStatus({
          type: 'success',
          message: '✅ No duplicates found! Your database is clean.'
        });
      } else {
        const totalDuplicates = duplicateGroups.reduce((sum, g) => sum + (g.count - 1), 0);
        setStatus({
          type: 'warning',
          message: `⚠️ Found ${duplicateGroups.length} sets of duplicates (${totalDuplicates} records to delete)`
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Error finding duplicates: ${error.message}`
      });
    } finally {
      setFinding(false);
    }
  };

  const deleteDuplicates = async () => {
    if (!confirm(`Are you sure you want to delete ${duplicates.reduce((sum, g) => sum + (g.count - 1), 0)} duplicate records? This cannot be undone!`)) {
      return;
    }

    setDeleting(true);
    setStatus({
      type: 'progress',
      message: 'Deleting duplicates...'
    });

    try {
      let deleted = 0;
      let failed = 0;

      for (const group of duplicates) {
        // Keep the first (oldest) record, delete the rest
        const toDelete = group.records.slice(1);
        
        for (const record of toDelete) {
          try {
            await deleteResult(record._id);
            deleted++;
            
            setStatus({
              type: 'progress',
              message: `Deleting... ${deleted}/${duplicates.reduce((sum, g) => sum + (g.count - 1), 0)} deleted`
            });
          } catch (error) {
            console.error(`Failed to delete ${record._id}:`, error);
            failed++;
          }
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await loadResults();
      setDuplicates([]);

      setStatus({
        type: 'success',
        message: `✅ Deleted ${deleted} duplicates${failed > 0 ? `, ${failed} failed` : ''}. Database cleaned!`
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Error deleting duplicates: ${error.message}`
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 mt-8">
      <h2 className="roboto text-black text-xl mb-4 flex items-center">
        <Trash2 size={20} className="mr-2 text-red-500" />
        Delete Duplicate Records
      </h2>

      <p className="text-black/70 text-sm mb-4">
        This will find and delete duplicate entries (same game + same date). 
        The oldest record for each duplicate set will be kept.
      </p>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={findDuplicates}
          disabled={finding || deleting}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {finding ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Finding...
            </div>
          ) : (
            'Find Duplicates'
          )}
        </button>

        {duplicates.length > 0 && (
          <button
            onClick={deleteDuplicates}
            disabled={deleting}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Deleting...
              </div>
            ) : (
              `Delete ${duplicates.reduce((sum, g) => sum + (g.count - 1), 0)} Duplicates`
            )}
          </button>
        )}
      </div>

      {status && (
        <div className={`p-4 rounded-lg border ${
          status.type === 'success' ? 'bg-green-500/20 text-green-800 border-green-500/30' :
          status.type === 'warning' ? 'bg-yellow-500/20 text-yellow-800 border-yellow-500/30' :
          status.type === 'progress' ? 'bg-blue-500/20 text-blue-800 border-blue-500/30' :
          'bg-red-500/20 text-red-800 border-red-500/30'
        }`}>
          {status.message}
        </div>
      )}

      {duplicates.length > 0 && (
        <div className="mt-4 max-h-60 overflow-y-auto">
          <p className="text-black/70 text-sm mb-2">Preview of duplicates:</p>
          {duplicates.slice(0, 10).map((group, i) => (
            <div key={i} className="bg-black/5 p-2 rounded mb-2 text-sm">
              <span className="font-medium">{group.game}</span> - {group.date} 
              <span className="text-red-500 ml-2">({group.count} records)</span>
            </div>
          ))}
          {duplicates.length > 10 && (
            <p className="text-black/60 text-xs">...and {duplicates.length - 10} more</p>
          )}
        </div>
      )}
    </div>
  );
};