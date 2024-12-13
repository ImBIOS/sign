'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppError } from '@documenso/lib/errors/app-error';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { SignaturePad } from '@documenso/ui/primitives/signature-pad';
import type { Toast } from '@documenso/ui/primitives/use-toast';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type DeleteTeamDialogProps = {
  teamId: number;
  trigger?: React.ReactNode;
};

export const DeleteTeamDialog = ({ trigger, teamId }: DeleteTeamDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const errorMessage = 'We need your signature to proceed';

  const ZDeleteTeamFormSchema = z.object({
    signature: z
      .string({ errorMap: () => ({ message: errorMessage }) })
      .min(1, { message: errorMessage }),
  });

  const form = useForm({
    resolver: zodResolver(ZDeleteTeamFormSchema),
    defaultValues: {
      signature: '',
    },
  });

  const { mutateAsync: deleteTeam } = trpc.team.deleteTeam.useMutation();

  const onFormSubmit = async () => {
    try {
      await deleteTeam({ teamId });

      toast({
        title: 'Success',
        description: 'Your team has been successfully deleted.',
        duration: 5000,
      });

      setOpen(false);

      router.push('/settings/teams');
    } catch (err) {
      const error = AppError.parseError(err);

      let toastError: Toast = {
        title: 'An unknown error occurred',
        variant: 'destructive',
        duration: 10000,
        description:
          'We encountered an unknown error while attempting to delete this team. Please try again later.',
      };

      if (error.code === 'resource_missing') {
        toastError = {
          title: 'Unable to delete team',
          variant: 'destructive',
          duration: 15000,
          description:
            'Something went wrong while updating the team billing subscription, please contact support.',
        };
      }

      toast(toastError);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={(value) => !form.formState.isSubmitting && setOpen(value)}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="destructive">Delete team</Button>}
      </DialogTrigger>

      <DialogContent position="center">
        <DialogHeader>
          <DialogTitle>Delete team</DialogTitle>

          <DialogDescription className="mt-4">
            Are you sure? This is irreversable.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <fieldset
              className="flex h-full flex-col space-y-4"
              disabled={form.formState.isSubmitting}
            >
              <FormField
                control={form.control}
                name="signature"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Sign Here</FormLabel>
                    <FormControl>
                      <SignaturePad
                        className="h-36 w-full"
                        disabled={form.formState.isSubmitting}
                        containerClassName="mt-2 rounded-lg border bg-background"
                        onChange={(v) => onChange(v ?? '')}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>

                <Button type="submit" variant="destructive" loading={form.formState.isSubmitting}>
                  Delete
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
