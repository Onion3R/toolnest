import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
type ErrorDialogProps = {
  error: {
    state: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null;
  setError: React.Dispatch<React.SetStateAction<{ message: string; state: boolean; onConfirm: () => void; onCancel: () => void } | null>>;
}

function ErrorDialog({ error, setError }: ErrorDialogProps) {
  return (
    <div>
      <AlertDialog onOpenChange={() => setError(null)} open={error?.state || false}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {error?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={error?.onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={error?.onConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog></div>
  )
}

export default ErrorDialog