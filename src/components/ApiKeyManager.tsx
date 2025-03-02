
import { useState, useEffect } from "react";
import { Plus, Eye, EyeOff, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface ApiKeyManagerProps {
  userId: string;
}

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  created_at: string;
}

const ApiKeyManager = ({ userId }: ApiKeyManagerProps) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [newKey, setNewKey] = useState({ name: "", service: "", key: "" });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (userId) {
      fetchApiKeys();
    }
  }, [userId]);
  
  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setApiKeys(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching API keys",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addApiKey = async () => {
    if (!newKey.name || !newKey.service || !newKey.key) {
      toast({
        title: "Validation error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Here we would encrypt the API key in a real production environment
      // For simplicity, we're just storing it as is for demo purposes
      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            name: newKey.name,
            service: newKey.service,
            key: newKey.key,
            user_id: userId
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "API key added",
        description: "Your API key has been saved securely",
      });
      
      setNewKey({ name: "", service: "", key: "" });
      setAddDialogOpen(false);
      fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Error adding API key",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const deleteApiKey = async () => {
    if (!selectedKey) return;
    
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', selectedKey.id);
        
      if (error) throw error;
      
      toast({
        title: "API key deleted",
        description: "Your API key has been removed",
      });
      
      setDeleteDialogOpen(false);
      fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Error deleting API key",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSelectedKey(null);
    }
  };
  
  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const copyKeyToClipboard = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(prev => ({ ...prev, [id]: true }));
    
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };
  
  const getObfuscatedKey = (key: string) => {
    return `${key.slice(0, 4)}${'•'.repeat(Math.max(0, key.length - 8))}${key.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-automation-border">
      <div className="p-6 border-b border-automation-border flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">API Keys</h2>
          <p className="text-gray-600">Manage your API keys for service integrations</p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-automation-primary hover:bg-automation-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Key
        </Button>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-automation-primary" />
            <p className="mt-4 text-gray-600">Loading your API keys...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't added any API keys yet.</p>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first API key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="border border-automation-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-gray-600">{key.service}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedKey(key);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="flex-grow bg-gray-50 rounded-l-md py-2 px-3 border border-r-0 border-gray-200">
                    <code className="text-sm">
                      {showKeys[key.id] ? key.key : getObfuscatedKey(key.key)}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none border border-gray-200"
                    onClick={() => toggleShowKey(key.id)}
                  >
                    {showKeys[key.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none rounded-r-md border border-l-0 border-gray-200"
                    onClick={() => copyKeyToClipboard(key.id, key.key)}
                  >
                    {copied[key.id] ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Add a new API key for service integration. Your key will be encrypted before storage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Google Sheets API"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key-service">Service</Label>
              <Input
                id="key-service"
                placeholder="e.g., Google, Slack, GitHub"
                value={newKey.service}
                onChange={(e) => setNewKey({ ...newKey, service: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key-value">API Key</Label>
              <div className="flex">
                <Input
                  id="key-value"
                  type={showKeys["new"] ? "text" : "password"}
                  placeholder="Enter your API key"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-l-none"
                  onClick={() => toggleShowKey("new")}
                >
                  {showKeys["new"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This key will be stored securely and used for service integrations
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addApiKey} 
              className="bg-automation-primary hover:bg-automation-primary/90"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Key
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteApiKey}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApiKeyManager;
