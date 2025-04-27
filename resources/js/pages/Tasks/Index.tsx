import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button, buttonVariants } from '@/components/ui/button';
import { type BreadcrumbItem, type PaginatedResponse, type Task } from '@/types';
import { TablePagination } from '@/components/table-pagination';
import { toast } from 'sonner';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
];

export default function Index({ tasks }: { tasks: PaginatedResponse<Task> }) {

    const deleteTask = (id: number) => {
        if (confirm('Are you sure?')) {
            router.delete(route('tasks.destroy', { id }));
            toast.success('Task deleted successfully');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks List" />
            <div className={'mt-8'}>
                <div className={'flex flex-row gap-x-4'}>
                    <Link className={buttonVariants({ variant: 'default' })} href="/tasks/create">
                        Create Task
                    </Link>
                    <Link className={buttonVariants({ variant: 'outline' })} href="/task-categories">
                        Manage Task Categories
                    </Link>
                </div>
                <Table className={'mt-4'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>File</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[100px]">Due Date</TableHead>
                            <TableHead className="w-[150px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.data.map((task: Task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.name}</TableCell>
                                <TableCell>{
                                    !task.mediaFile
                                        ? ''
                                        : (
                                            <a href={task.mediaFile.original_url} target="_blank">
                                                <img src={task.mediaFile.original_url} className={'w-8 h-8'} />
                                            </a>
                                        )
                                }
                                </TableCell>
                                <TableCell className={task.is_completed ? 'text-green-600' : 'text-red-700'}>
                                    {task.is_completed ? 'Completed' : 'In Progress'}
                                </TableCell>
                                <TableCell>{task.due_date ? format(task.due_date, 'PPP') : ''}</TableCell>
                                <TableCell className="flex flex-row gap-x-2 text-right">
                                    <Link className={buttonVariants({ variant: 'default' })}
                                          href={`/tasks/${task.id}/edit`}>
                                        Edit
                                    </Link>

                                    <Button variant={'destructive'} className={'cursor-pointer'} onClick={() => deleteTask(task.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination resource={tasks} />
            </div>
        </AppLayout>
    );
}
