export async function get(){

    const transport = await import.meta.glob('./transports/*.md');
    console.log(transport);
    return transport;

}
